import deeptrack as dt
import inspect
import re
from .utils import safe_issubclass
import grpc_routing_pb2

# Do not copy features from these modules
MODULE_BLACKLIST = ["deeptrack"]
# Do not copy these features
FEATURE_BLACKLIST = [
    "Feature",
    "Branch",
    "Scatterer",
    "Aberration",
    "Optics",
    "Load",
    "Noise",
    "StructuralFeature",
    "MieScatterer",
    "Blur",
    "BlurCV2",
    "KerasModel",
    "Model",
    "cgan",
    "Noise",
]

features = []

modules = inspect.getmembers(dt, inspect.ismodule)

for module_name, module in modules:

    if module_name in MODULE_BLACKLIST:
        continue

    module_dict = {}

    classes = inspect.getmembers(
        module, lambda x: inspect.isclass(x) or inspect.isfunction(x)
    )

    for class_name, module_class in classes:
        if (
            safe_issubclass(module_class, dt.features.Feature)
            and class_name not in FEATURE_BLACKLIST
        ):
            # Get description
            if module_class.__doc__:
                description = module_class.__doc__[
                    : module_class.__doc__.find("Parameters")
                ]
            else:
                description = ""

            # Get properties...

            arg_dict = {}
            subclass_iterator = module_class.mro()

            properties = []
            for feature_class in subclass_iterator:

                if safe_issubclass(feature_class, dt.features.Feature):
                    argspec = inspect.getfullargspec(feature_class.__init__)
                elif callable(feature_class):
                    argspec = inspect.getfullargspec(feature_class)
                else:
                    continue

                arglist = argspec.kwonlyargs or argspec.args or []

                if arglist and arglist[0] == "self":
                    arglist = arglist[1:]

                defaultlist = argspec.kwonlydefaults or argspec.defaults or []

                try:
                    defaultlist = list(defaultlist.values())
                except:
                    pass

                
                for idx in range(len(arglist)):
                    annotation = False

                    if arglist[idx] in argspec.annotations:
                        annotation = repr(argspec.annotations[arglist[idx]])

                    default = None

                    try:
                        pos = idx - (len(arglist) - len(defaultlist))
                        if pos >= 0:
                            default = defaultlist[pos]
                            if callable(default):
                                default = None
                    except:
                        pass

                    regex = (
                        r"^( *)(?:.{0}|\S.*)("
                        + re.escape(arglist[idx])
                        + r")(?:(?:[, ][^:\n]*:|:) *(.*)| *)((?:(?:\n|\n\r|\r)^\1 +.*)+)"
                    )

                    docstring = (
                        feature_class.__doc__.replace("\t", "    ")
                        if feature_class.__doc__
                        else ""
                    )

                    docstring_search = re.search(
                        regex,
                        docstring,
                        flags=re.MULTILINE,
                    )

                    if docstring_search is not None:
                        docstring_search = list(docstring_search.groups())[1:]

                    if arglist[idx] not in arg_dict:
                        arg_dict[arglist[idx]] = {
                            "value": "",
                            "name": arglist[idx],
                            # "annotation": "",
                            # "type": "property",
                        }

                    if default is not None:
                        arg_dict[arglist[idx]]["value"] = repr(default)
                    # if annotation:
                    #     arg_dict[arglist[idx]]["annotation"] = annotation
                    if docstring_search and "description" not in arg_dict[arglist[idx]]:
                        arg_dict[arglist[idx]]["description"] = docstring_search

            
            properties = [grpc_routing_pb2.Property(**kwargs) for kwargs in arg_dict.values()]
            

            features.append(
                grpc_routing_pb2.Feature(
                    package=module_name,
                    name=class_name,
                    description=description,
                    properties=properties,
                )
            )
            # print(features[-1]properties)


def get_all_features_for_frontend():
    return features


def get_feature_for_frontend(module_name: str, feature_name: str):
    for feature in features:
        if feature.package == module_name and feature.name == feature_name:
            return feature

    return None


def get_feature_for_backend(module_name: str, feature_name: str):
    module = getattr(dt, module_name)
    return getattr(module, feature_name)